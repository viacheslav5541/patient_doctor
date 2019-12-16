const initialState = {
     name : '',
     lname : '',
     error : ''
}

export default function(state = initialState,action){
    switch(action.type) {
        case "LOGIN_SUCCSEC":
            {
                return {name : action.payload.name, lname : action.payload.lname, error : "Проходите пожалуйста"}
                
            }
        case "LOGIN FAILED":
            return{error : action.payload}
            
            
        default:
            return state;
        
    break;
        


    }


}