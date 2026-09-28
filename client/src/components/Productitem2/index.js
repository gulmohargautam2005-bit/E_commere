import { useEffect, useState } from "react";
import Itemtwo from "../Itemtwo";

const Productitem2 = (props) => {
    const [productData, setproductData] = useState([]);
    const viewClass = props.itemview || "four";

    useEffect(() => {
        if (props.data && props.data.length > 0) {
            setproductData(props.data);
        }
    }, [props.data]);

    return (
        <div className={`productrow2 ${viewClass}`}>
            {productData.map((item) => (
                <div key={item._id} className="product-col">
                    <Itemtwo item={item} />
                </div>
            ))}
        </div>
    );
};

export default Productitem2;