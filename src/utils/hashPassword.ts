import * as bcrypt from 'bcrypt'

export const hashPassword = async (password : string) =>  {
    const hashedPassword = await bcrypt.hash(password, 10)
    return  hashedPassword
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    console.log(password,hashedPassword)
    const isValid = await bcrypt.compare(password, hashedPassword)
    return isValid
}
