with open('check_syntax.js', 'rb') as f:
    data = f.read()

target = "j'ai"
idx = data.decode('utf-8').find(target)
if idx >= 0:
    print("Found j'ai at char %d" % idx)
    chunk = data[idx-20:idx+40]
    print("Bytes around it:")
    for i in range(max(0, idx-20), min(len(data), idx+40)):
        b = data[i]
        ch = chr(b) if 32 <= b < 127 else '.'
        print("  byte %d: 0x%02x = %s" % (i, b, ch))
else:
    print("Not found")

# Also check for any bytes > 127 that might be wrong encoding
non_ascii = [(i, data[i]) for i in range(len(data)) if data[i] > 127]
print("\nNon-ASCII bytes: %d" % len(non_ascii))
if non_ascii:
    for pos, b in non_ascii[:30]:
        context = data[max(0,pos-5):pos+5]
        print("  byte %d: 0x%02x in context: %s" % (pos, b, repr(context)))
