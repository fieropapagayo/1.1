import re

html = open(r'nullbyte.html', 'r', encoding='utf-8').read()

# Extract just the forum IIFE
start = html.find('// ============ COMMUNITY FORUM ============')
end = html.find('// ============ THEME CUSTOMIZER ============')
if start < 0 or end < 0:
    print('Forum section not found')
    exit()

forum = html[start:end]

b=p=br=0
si=di=ti=0
bc=lc=False

for i,ch in enumerate(forum):
    if bc:
        if ch=='*' and i+1<len(forum) and forum[i+1]=='/':
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
    if ch=='/' and i+1<len(forum):
        if forum[i+1]=='/':
            lc=True
            continue
        if forum[i+1]=='*':
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

print(f'Forum section balance: braces={b} parens={p} brackets={br}')
if b==0 and p==0 and br==0:
    print('Forum code is balanced!')
else:
    print('Forum code has imbalance!')
