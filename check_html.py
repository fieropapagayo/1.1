with open('nullbyte.html', 'r', encoding='utf-8-sig') as f:
    html = f.read()

# Find the script tag
script_start = html.index('<script>') + 8
script_end = html.index('</script>', script_start)
js = html[script_start:script_end]
lines = js.split('\n')

# Check for any < characters that aren't in strings/template literals
in_single = False
in_double = False
in_template = False
in_block_comment = False
in_line_comment = False

for i, line in enumerate(lines):
    j = 0
    in_line_comment = False
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
            if ch == '\\' and j+1 < len(line):
                j += 2
                continue
            if ch == "'":
                in_single_str = False
            j += 1
            continue
        if in_double_str:
            if ch == '\\' and j+1 < len(line):
                j += 2
                continue
            if ch == '"':
                in_double_str = False
            j += 1
            continue
        if in_template:
            if ch == '\\' and j+1 < len(line):
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
        elif ch == '<' and j+1 < len(line) and line[j+1] == '/':
            print("WARNING: </ found outside string at line %d col %d" % (i+1, j+1))
            print("  Line: %s" % line.strip()[:120])
        j += 1

print("Scan complete.")
