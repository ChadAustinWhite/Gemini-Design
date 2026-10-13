export function serializeMark(svg: SVGSVGElement, bg: string) {
  const clone = svg.cloneNode(true) as SVGSVGElement
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', '800')
  clone.setAttribute('height', '800')
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('width', '200')
  rect.setAttribute('height', '200')
  rect.setAttribute('fill', bg)
  clone.insertBefore(rect, clone.firstChild)
  return new XMLSerializer().serializeToString(clone)
}

export function downloadBlob(filename: string, blob: Blob) {
  const a = document.createElement('a')
  const url = URL.createObjectURL(blob)
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadText(filename: string, text: string, type: string) {
  downloadBlob(filename, new Blob([text], { type }))
}

export function rasterize(source: string, bg: string) {
  return new Promise<Blob>((resolve, reject) => {
    const img = new Image()
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 800
      canvas.height = 800
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('canvas'))
        return
      }
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, 800, 800)
      ctx.drawImage(img, 0, 0, 800, 800)
      canvas.toBlob((out) => {
        URL.revokeObjectURL(url)
        if (out) resolve(out)
        else reject(new Error('blob'))
      }, 'image/png')
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image'))
    }
    img.src = url
  })
}

export function fileSlug(title: string, name: string) {
  return `${title}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
