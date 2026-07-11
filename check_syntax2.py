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

errors = []

for i, line in enumerate(lines):
    in_line_comment = False
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
        
        # Handle regex-like patterns: after = or , or ( or [ or ! or & or | or ; or return or typeof or case
        if ch == '/' and j+1 < len(line):
            if line[j+1] == '/':
                in_line_comment = True
                j += 2
                continue
            if line[j+1] == '*':
                in_block_comment = True
                j += 2
                continue
            # Check if this is likely a regex (not division)
            # Look backwards at non-whitespace
            k = j - 1
            while k >= 0 and line[k] in ' \t':
                k -= 1
            if k >= 0:
                prev = line[k]
                if prev in '=({[,;!&|?:+->~^%*\n}]:':
                    # Likely a regex
                    j += 1  # skip opening /
                    in_regex = True
                    while j < len(line):
                        rc = line[j]
                        if rc == '\\':
                            j += 2
                            continue
                        if rc == '/':
                            in_regex = False
                            j += 1
                            # Check for regex flags
                            while j < len(line) and line[j] in 'gimsuy':
                                j += 1
                            break
                        j += 1
                    continue
        
        if ch == "'":
            in_single_str = True
        elif ch == '"':
            in_double_str = True
        elif ch == '`':
            in_template = True
        elif ch == '{':
            brace_depth += 1
        elif ch == '}':
            brace_depth -= 1
            if brace_depth < 0:
                errors.append(f'NEGATIVE BRACE DEPTH at line {i+1}: depth={brace_depth}')
        elif ch == '(':
            paren_depth += 1
        elif ch == ')':
            paren_depth -= 1
            if paren_depth < 0:
                errors.append(f'NEGATIVE PAREN DEPTH at line {i+1}: depth={paren_depth}')
        elif ch == '[':
            bracket_depth += 1
        elif ch == ']':
            bracket_depth -= 1
            if bracket_depth < 0:
                errors.append(f'NEGATIVE BRACKET DEPTH at line {i+1}: depth={bracket_depth}')
        
        j += 1

print(f'Total lines: {len(lines)}')
print(f'Final brace depth: {brace_depth} (should be 0)')
print(f'Final paren depth: {paren_depth} (should be 0)')
print(f'Final bracket depth: {bracket_depth} (should be 0)')
print(f'In string: single={in_single_str}, double={in_double_str}, template={in_template}')
print(f'In block comment: {in_block_comment}')
print(f'Errors: {len(errors)}')
for e in errors:
    print(f'  {e}')

if brace_depth == 0 and paren_depth == 0 and bracket_depth == 0 and not in_single_str and not in_double_str and not in_template:
    print('\nAll delimiters balanced!')
else:
    print('\nMISMATCH DETECTED!')
