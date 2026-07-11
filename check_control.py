with open('check_syntax.js', 'r', encoding='utf-8-sig') as f:
    js = f.read()

# Find any control characters (0x00-0x1F except tab=0x09, newline=0x0A, CR=0x0D)
lines = js.split('\n')
for i, line in enumerate(lines):
    for j, ch in enumerate(line):
        code = ord(ch)
        if code < 0x20 and code not in (0x09, 0x0A, 0x0D):
            print("Control char at line %d col %d: U+%04X" % (i+1, j+1, code))
        elif code in (0xFEFF, 0x200B, 0x200C, 0x200D, 0x2060, 0x00A0):
            print("Special char at line %d col %d: U+%04X" % (i+1, j+1, code))

# Also look for right-to-left marks, BOM inside, etc.
import unicodedata
for i, ch in enumerate(js):
    code = ord(ch)
    if code > 127:
        cat = unicodedata.category(ch)
        if cat.startswith('C') and cat != 'Cc':
            line_num = js[:i].count('\n') + 1
            col = i - js[:i].rfind('\n')
            print("Non-printable Unicode at char %d (line %d col %d): U+%04X category=%s" % (i, line_num, col, code, cat))

print("Done scanning.")
