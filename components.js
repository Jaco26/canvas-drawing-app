function createInput({ labelText, id, type, value, onInput }) {
  return createElement('div',
    {
      style: { margin: '0.6rem 0' }
    },
    [
      createElement('label', { attrs: { for: id }}, [labelText]),
      createElement('input',
        {
          attrs: { type, value, id },
          on: { input: onInput },
        },
      )
    ]
  )
}