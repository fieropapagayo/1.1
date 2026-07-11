import re

html = open(r'nullbyte.html', 'r', encoding='utf-8').read()
matches = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
js = '\n\n'.join(matches)

sections = [
    ('Main IIFE + data', 0, js.find('// ============ COMMUNITY FORUM ============', 0)),
    ('Forum', js.find('// ============ COMMUNITY FORUM ============'), js.find('// ============ THEME CUSTOMIZER ============')),
    ('Theme Customizer', js.find('// ============ THEME CUSTOMIZER ============'), len(js)),
]

def check_balance(code):
    b=p=br=0
    si=di=ti=0
    bc=lc=False
    for i,ch in enumerate(code):
        if bc:
            if ch=='*' and i+1<len(code) and code[i+1]=='/':
                bc=False
            continue
        if lc:
            if ch=='\n':
                lc=False
            continue
        if si:
            if ch=='\\':
                si=False
                continue
            if ch=="'":
                si=False
            continue
        if di:
            if ch=='\\':
                di=False
                continue
            if ch=='"':
                di=False
            continue
        if ti:
            if ch=='\\':
                ti=False
                continue
            if ch=='`':
                ti=False
            continue
        if ch=='/' and i+1<len(code):
            if code[i+1]=='/':
                lc=True
                continue
            if code[i+1]=='*':
                bc=True
                continue
        if ch=="'":
            si=True
        elif ch=='"':
            di=True
        elif ch=='`':
            ti=True
        elif ch=='{':
            b+=1
        elif ch=='}':
            b-=1
        elif ch=='(':
            p+=1
        elif ch==')':
            p-=1
        elif ch=='[':
            br+=1
        elif ch==']':
            br-=1
    return b,p,br

for name,s,e in sections:
    if s < 0 or e < 0 or s >= e:
        print(f'{name}: SKIPPED (not found)')
        continue
    b,p,br = check_balance(js[s:e])
    status = 'OK' if b==0 and p==0 and br==0 else f'IMBALANCED braces={b} parens={p} brackets={br}'
    print(f'{name}: {status}')

# Overall
b,p,br = check_balance(js)
status = 'OK' if b==0 and p==0 and br==0 else f'IMBALANCED braces={b} parens={p} brackets={br}'
print(f'\nOverall: {status}')
