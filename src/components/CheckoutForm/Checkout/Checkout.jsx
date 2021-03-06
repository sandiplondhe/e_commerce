import React,{useState,useEffect} from 'react'
import { Paper,Stepper,Step,StepLabel,Typography,CircularProgress,Divider,Bottom } from '@material-ui/core';
import useStyles from './styles'
import AddressForm from './../AddressForm'
import PaymentForm from './../PaymentForm'
import { commerce } from '../../../lib/commerce';

const steps=["Shipping Address","Payment Details"]

const Checkout = ({cart,order,errorMessage,onCaptureCheckout}) => {
    const [activeStep,setActiveStep]=useState(0);
    const [checkoutToken,setCheckoutToken]=useState(null);
    const [shippingData, setShippingData] = useState({})
    const classes=useStyles();
    useEffect(() =>{
        const generateToken=async() =>{
            try {
                    const token=await commerce.checkout.generateToken(cart.id,{type:'cart'})
                    setCheckoutToken(token)
            } catch (error) {
                
            }
        }
        generateToken();
    },[cart])
   
    const nextStep=()=>setActiveStep((prevStep)=>prevStep+1)
    const backStep=()=>setActiveStep((prevStep)=>prevStep-1)

    const next=(data)=>{
        setShippingData(data)
        nextStep()
    }

   const Form=()=>activeStep==0?<AddressForm checkoutToken={checkoutToken} next={next}/>:<PaymentForm shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep}/>
   const Confirmation=()=>(
       <div>Confirmation</div>
   )
    return (
       <>
      <div className={classes.toolbar}/>
      <main className={classes.layout}>
          <Paper className={classes.paper}>
                <Typography variant="h4" align="center">Checkout</Typography>
                <Stepper activeStep={activeStep} className={classes.stepper}>
                    {steps.map(step =>(
                        <Step id={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {activeStep===steps.length ?<Confirmation/>:checkoutToken && <Form/>}
          </Paper>
      </main>
       </>
    )
}
export default Checkout;