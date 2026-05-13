import os
import sys
import glob
from html.parser import HTMLParser

# Walk up from this script's location until we find a MyTravels directory
def _find_project_root():
    d = os.path.dirname(os.path.abspath(__file__))
    for _ in range(6):
        if os.path.isdir(os.path.join(d, 'MyTravels')):
            return d
        d = os.path.dirname(d)
    return os.getcwd()

PROJECT_ROOT = _find_project_root()

SKIP_TAGS = {'script', 'style', 'head', 'nav', 'footer'}
CONTENT_TAGS = {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}

class ReadTimeParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self._skip_depth  = 0   # depth inside a skipped tag
        self._in_main     = False
        self._words       = []
        self._images      = 0
        self._tag_stack   = []

    def handle_starttag(self, tag, attrs):
        self._tag_stack.append(tag)
        if tag == 'main':
            self._in_main = True
        if tag in SKIP_TAGS:
            self._skip_depth += 1
        if self._in_main and self._skip_depth == 0 and tag == 'img':
            # Exclude nav logo (src contains "logo")
            src = dict(attrs).get('src', '')
            if 'logo' not in src:
                self._images += 1

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS:
            self._skip_depth = max(0, self._skip_depth - 1)
        if tag == 'main':
            self._in_main = False
        if self._tag_stack and self._tag_stack[-1] == tag:
            self._tag_stack.pop()

    def handle_data(self, data):
        if not self._in_main or self._skip_depth > 0:
            return
        text = data.strip()
        if text:
            self._words.extend(text.split())

    @property
    def word_count(self):
        return len(self._words)

    @property
    def image_count(self):
        return self._images


def image_time_seconds(n):
    total = 0
    for i in range(1, n + 1):
        total += max(3, 13 - i)   # 12s, 11s, ... floor at 3s
    return total


def find_page(query):
    base = os.path.join(PROJECT_ROOT, 'MyTravels')
    pattern = os.path.join(base, f'*{query}*.html')
    matches = glob.glob(pattern)
    if not matches:
        return None
    # Prefer exact stem match
    for m in matches:
        if os.path.splitext(os.path.basename(m))[0] == query:
            return m
    return matches[0]


def estimate(path):
    with open(path, encoding='utf-8') as f:
        html = f.read()

    parser = ReadTimeParser()
    parser.feed(html)

    words  = parser.word_count
    images = parser.image_count

    text_min  = words / 225
    img_sec   = image_time_seconds(images)
    img_min   = img_sec / 60
    total_min = text_min + img_min

    def fmt(minutes):
        rounded = round(minutes * 2) / 2   # nearest 0.5
        if rounded == int(rounded):
            return f"{int(rounded)} min"
        return f"{rounded:.1f} min"

    page = os.path.splitext(os.path.basename(path))[0]
    print(f"\nPage:          {page}")
    print(f"Words:         {words:,}")
    print(f"Images:        {images}")
    print(f"Text time:     {fmt(text_min)}")
    print(f"Image time:    {fmt(img_min)}")
    print(f"Total:         {fmt(total_min)}")


if __name__ == '__main__':
    query = sys.argv[1] if len(sys.argv) > 1 else ''
    if not query:
        # List available pages
        base = os.path.join(PROJECT_ROOT, 'MyTravels')
        pages = [os.path.splitext(os.path.basename(p))[0]
                 for p in glob.glob(os.path.join(base, '*.html'))
                 if 'destinations' not in p]
        print("Available pages:")
        for p in sorted(pages):
            print(f"  {p}")
        sys.exit(0)

    path = find_page(query)
    if not path:
        print(f"No page found matching '{query}'")
        sys.exit(1)

    estimate(path)
