const createElement = (tag, attrs, ...children) => {
  return {
    tag,
    attrs,
    children,
  }
}

export default createElement;
