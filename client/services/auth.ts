export const authorized = () => {
  const user = localStorage.getItem('authUser')
  if (user) {
    const parsedUser = JSON.parse(user)
    return parsedUser
  }
  return
}
