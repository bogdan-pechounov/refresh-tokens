export function getRoot(id) {
  let root = document.getElementById(id)
  if (!root) {
    //html not present in tests during the first render
    root = document.createElement('div')
    root.setAttribute('id', id)
    document.body.appendChild(root)
  }
  return root
}
