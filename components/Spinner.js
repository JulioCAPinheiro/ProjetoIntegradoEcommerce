import { PulseLoader } from "react-spinners";

export default function Spinner({fullWidth}){
    if (fullWidth){
        return(
            <div>
               <PulseLoader color={'#1E3ABA'} speedMultiplier={2}/>     
            </div>
                
        );

    }
    return (
        <PulseLoader color="#1E3A8A" speedMultiplier={2} />
    );
    
}