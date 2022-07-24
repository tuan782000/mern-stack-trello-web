/**
 * Created by trungquandev.com's author on 04/11/2021
 */

// onKeyDown
export const saveContentAfterPressEnter = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    e.target.blur()
  }
}

// Select all input values when click
export const selectAllInlineText = (e) => {
  e.target.focus()
  e.target.select()
  // document.execCommand('selectAll', false, null)
}
