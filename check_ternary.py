import re

with open(r'C:\Users\Chema\Downloads\web cheats\nullbyte.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines, 1):
    # Find all template ${...} expressions
    for m in re.finditer(r'\$\{([^}]+)\}', line):
        expr = m.group(1)
        # Check for ternary without colon (simplified check)
        parts = expr.split('?')
        if len(parts) > 1:
            # Check if the ternary has a colon after the ? part
            after_question = parts[-1]
            if ':' not in after_question and "''" not in after_question and '""' not in after_question:
                # Could be a ternary missing the else branch
                if 'featured' in expr or 'method' in expr or 'status' in expr:
                    print(f"Line {i}: Possible broken ternary: {expr.strip()}")
