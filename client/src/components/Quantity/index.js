import { FaPlus } from "react-icons/fa6";
import { Button } from "@mui/material";
import { FaMinus } from "react-icons/fa";
import { useEffect, useState } from "react";
const Quantity = (props) => {
    const [inputval, setinputval] = useState(props.initialValue || 1);


    const plus=()=>{
        setinputval(inputval+1)

    }
    const minus=()=>{
        if(inputval>1)
            {
                  setinputval(inputval-1)
            }
   
    }

    useEffect(()=>{
        if (typeof props.quantity === 'function') {  // ← guard
            props.quantity(inputval);
          }

    },[inputval])
   
    return (<><div className="quantitydrop d-flex align-item-center">
        <Button onClick={minus}><FaMinus /></Button>
        <input type="text"  value={inputval}         onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val) && val >= 1) setinputval(val);
        }}
/>
        <Button onClick={plus}><FaPlus /></Button>
        

    </div>

        

    </>)
}
export default Quantity;