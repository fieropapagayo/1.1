import re

with open(r'check_syntax.js', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')

brace_depth = 0
paren_depth = 0
bracket_depth = 0
in_single_str = False
in_double_str = False
in_template = False
in_line_comment = False
in_block_comment = False
in_regex = False

# Track depth changes per line
changes = []

for i, line in enumerate(lines):
    in_line_comment = False
    line_brace = 0
    line_paren = 0
    j = 0
    while j < len(line):
        ch = line[j]
        
        if in_block_comment:
            if ch == '*' and j+1 < len(line) and line[j+1] == '/':
                in_block_comment = False
                j += 1
            j += 1
            continue
        
        if in_line_comment:
            j += 1
            continue
            
        if in_single_str:
            if ch == '\\':
                j += 2
                continue
            if ch == "'":
                in_single_str = False
            j += 1
            continue
        
        if in_double_str:
            if ch == '\\':
                j += 2
                continue
            if ch == '"':
                in_double_str = False
            j += 1
            continue
        
        if in_template:
            if ch == '\\':
                j += 2
                continue
            if ch == '`':
                in_template = False
            j += 1
            continue
        
        if ch == '/' and j+1 < len(line):
            if line[j+1] == '/':
                in_line_comment = True
                j += 2
                continue
            if line[j+1] == '*':
                in_block_comment = True
                j += 2
                continue
        
        if ch == "'":
            in_single_str = True
        elif ch == '"':
            in_double_str = True
        elif ch == '`':
            in_template = True
        elif ch == '{':
            brace_depth += 1
            line_brace += 1
        elif ch == '}':
            brace_depth -= 1
            line_brace -= 1
        elif ch == '(':
            paren_depth += 1
            line_paren += 1
        elif ch == ')':
            paren_depth -= 1
            line_paren -= 1
        elif ch == '[':
            bracket_depth += 1
        elif ch == ']':
            bracket_depth -= 1
        
        j += 1
    
    if line_brace != 0 or line_paren != 0:
        changes.append((i+1, line_brace, line_paren, brace_depth, paren_depth, line.strip()[:80]))

print('=== Lines where depth changes ===')
for ln, lb, lp, bd, pd, txt in changes:
    markers = []
    if lb != 0:
        markers.append(f'braces({lb:+d}={bd})')
    if lp != 0:
        markers.append(f'parens({lp:+d}={pd})')
    print(f'  L{ln:4d}: {" ".join(markers):40s} | {txt}')
