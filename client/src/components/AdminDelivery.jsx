import React, {useState} from 'react'
import { GET_ALL_PRODUCTS_ADMIN } from '../utils/queries';
import { CREATE_DELIVERY } from '../utils/mutations';
import { useQuery, useMutation } from '@apollo/client';
import '../styles/AdminDelivery.css'
import AdminDeliveryList from './AdminDeliveryList';
function AdminDelivery() {
  
  const [requestPreview, setRequestPreview] = useState([]) 
  const [createDelivery] = useMutation(CREATE_DELIVERY)
  
  const handleDeliveryCreation = async (event) =>{
    try{
      const creatingANewDelivery = await createDelivery({
        variables: { products: productIdListForDelivery},
      });
      console.log(creatingANewDelivery)
      setRequestPreview([])
    } catch (e) {
      console.log(e);
  }
  }

  
  
  
  let productIdListForDelivery = []
      requestPreview.map((productIds)=>{
      productIdListForDelivery.push(productIds._id)
      return productIdListForDelivery
    })



  const handleAddToDelivery = (event) =>{
    const productClicked = event.target.dataset
    const productClickedObj = {
      "_id": productClicked.id,
      "name": productClicked.name,
      "description": productClicked.description,
      "images": productClicked.images,
      "price": productClicked.price,
      "cost": productClicked.cost,
      "parStock": productClicked.parstock,
      "quantity": productClicked.quantity,
    }

 

    //checks current array to make sure we dont add duplicates
    //this throws error about react keys in a map
    //better ux anyways
    let deliveryArray = requestPreview
    for (let i = 0; i < deliveryArray.length; i++) {
      const deliveryNoDubplicates = deliveryArray[i]._id;
      
      if(productClickedObj._id.includes(deliveryNoDubplicates)){
        console.log('Already In Delivery')
        return
      }
    }

    //updates delivery array and sets it to the reviewPreview 
    //reviewPreview is passed as props into AdminDeliveryList
    deliveryArray.push(productClickedObj)
    setRequestPreview([...deliveryArray])
    

    
  }





  
// Display all products in spreadsheet format
//shows id cost parStock quantity add to delivery buttons
let productList;
const { loading, error, data } = useQuery(GET_ALL_PRODUCTS_ADMIN);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    if(!loading && !error){
    productList = data.allproducts
    }
    return(

      <div className='container'>
        {/* Spreadsheet Labels */}
          <div className="admin-delivery">
            <h3>Inventory List</h3>
            <div className="admin-delivery-list">
              <h3 className="admin-delivery-item admin-delivery-item-label">Id</h3>
              <h3 className="admin-delivery-item admin-delivery-item-label">Cost</h3>
              <h3 className="admin-delivery-item admin-delivery-item-label">ParStock</h3>
              <h3 className="admin-delivery-item admin-delivery-item-label">Quantity</h3>
              {/* <h3 className="admin-delivery-item admin-delivery-item-label" id='addProduct'>+</h3> */}
            </div>
        {/* Spreadsheet content  */}
          {productList.map((delivery) => {
              return  <div className="admin-delivery-list" key={delivery._id}>
        
                        <p className="admin-delivery-item" id='productname'>{delivery._id}</p>
                        <p className="admin-delivery-item">{delivery.cost}</p>
                        <p className="admin-delivery-item">{delivery.parStock}</p>
                        <p className="admin-delivery-item">{delivery.quantity}</p>
                        <p className="admin-delivery-item" id='productdelete' onClick={handleAddToDelivery}
                          data-id={delivery._id}
                          data-name={delivery.name}
                          data-description={delivery.description}
                          data-images={delivery.images}
                          data-price={delivery.price}
                          data-cost={delivery.cost}
                          data-parstock={delivery.parStock}
                          data-quantity={delivery.quantity}
                          >+</p>
        
                      </div>
          })}
          </div>
            {/* Spreadsheet Labels */}
            <div className="admin-delivery">
            <h3>Delivery Preview<button className='admin-delivery-item' onClick={handleDeliveryCreation}>Create</button></h3>
            
              <div className="admin-delivery-list">
                <h3 className="admin-delivery-item admin-delivery-item-label">Id</h3>
                <h3 className="admin-delivery-item admin-delivery-item-label">Cost</h3>
                <h3 className="admin-delivery-item admin-delivery-item-label">ParStock</h3>
                <h3 className="admin-delivery-item admin-delivery-item-label">Quantity</h3>
                {/* <h3 className="admin-delivery-item admin-delivery-item-label" id='addProduct'>+</h3> */}
              </div>
          <AdminDeliveryList requestPreview={requestPreview}/>
          </div>
      </div>
    )
}

export default AdminDelivery