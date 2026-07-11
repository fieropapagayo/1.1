with open('check_syntax.js', 'r', encoding='utf-8-sig') as f:
    js = f.read()

# Search for j'ai specifically
lines = js.split('\n')
for i, line in enumerate(lines):
    if 'j' in line and "'" in line and 'besoin' in line:
        print("Line %d: %s" % (i+1, repr(line.strip()[:150])))

# Check for </script> inside the JS
if '</script>' in js.lower():
    print("\nWARNING: </script> found inside JS!")
    
# Look for < followed by / inside the JS (potential HTML parsing issue)
import re
for m in re.finditer(r'</\w', js):
    pos = m.start()
    # Find line number
    line_num = js[:pos].count('\n') + 1
    context = js[max(0,pos-20):pos+30]
    print("</ at line %d: %s" % (line_num, repr(context)))

# Look for potential template literal issues
backtick_positions = [i for i, ch in enumerate(js) if ch == '`']
print("\nBacktick count: %d (should be even: %s)" % (len(backtick_positions), len(backtick_positions) % 2 == 0))

# Check if there are any stray angle brackets
for m in re.finditer(r'<(?![a-zA-Z/!])', js):
    pos = m.start()
    line_num = js[:pos].count('\n') + 1
    context = js[max(0,pos-10):pos+20]
    print("Stray < at line %d: %s" % (line_num, repr(context)))
