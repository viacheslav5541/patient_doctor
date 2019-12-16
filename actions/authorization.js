export const autorizating = (login,password,patient) => {
    if(login == patient.login && password == patient.password)
        return{
            type:'LOGIN_SUCCSEC',
            payload:patient
        }
    else{
        return{
            type:'LOGIN FAILED',
            payload:"Sorry,you are not kekich"
        }
    }
        

}