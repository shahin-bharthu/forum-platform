import bcrypt from 'bcryptjs'

const encryptPassword = async (password) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);  // random salt generation

    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

const verifyPassword = async (plainPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch; 
}

export {encryptPassword, verifyPassword}