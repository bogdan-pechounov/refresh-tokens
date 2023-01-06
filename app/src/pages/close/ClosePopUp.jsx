function ClosePopUp() {
  if (window.opener) {
    //reload parent window
    window.opener.location.reload()
    //close pop up
    window.close()
  }
}

export default ClosePopUp
