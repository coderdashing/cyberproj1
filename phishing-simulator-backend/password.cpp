class Password {
    string password;
    public:
    bool strong(){
        int lower = 0;
        int upper = 0;
        int digit = 0;
        int symbol = 0;
        for(int i = 0; i < password.length(); i++){
            if(password[i] >= 'a' && password[i] <= 'z'){
                lower++;
            }
            else if(password[i] >= 'A' && password[i] <= 'Z'){
                upper++;
                
            }
            else if(password[i] >= '0' && password[i] <= '9'){
                digit++;
            }
            else{
                symbol++;
            }
        }
        if(lower >= 1 && upper >= 1 && digit >= 1 && symbol >= 1 && password.length() >= 8){
            return true;
        }
        else{
            return false;
        }
    }
    double strength(){
        int lower = 0;
        int upper = 0;
        int digit = 0;
        int symbol = 0;
        for(int i = 0; i < password.length(); i++){
            if(password[i] >= 'a' && password[i] <= 'z'){
                lower++;
            }
            else if(password[i] >= 'A' && password[i] <= 'Z'){
                upper++;
                
            }
            else if(password[i] >= '0' && password[i] <= '9'){
                digit++;
            }
            else{
                symbol++;
            }
        }
        return (lower + upper + digit + symbol) / password.length();
        
    }
};
