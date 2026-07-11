import re

html = open(r'nullbyte.html', 'r', encoding='utf-8').read()
matches = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
js = '\n\n'.join(matches)

b=p=br=0
si=di=ti=0
bc=lc=False

for i,ch in enumerate(js):
    if bc:
        if ch=='*' and i+1<len(js) and js[i+1]=='/':
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
    if ch=='/' and i+1<len(js):
        if js[i+1]=='/':
            lc=True
            continue
        if js[i+1]=='*':
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

print(f'Manual check: braces={b} parens={p} brackets={br}')
