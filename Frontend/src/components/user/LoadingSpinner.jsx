import useSpinnerStore from "../../store/useSpinnerStore";


function LoadingSpinner() {

    const message = useSpinnerStore(state => state.message);
    const showSpinner = useSpinnerStore(state => state.showSpinner);
    


    return (
        showSpinner &&
        <div className="fixed top-10 z-50">

            <div className="mb-3 inline-flex w-full items-center rounded-lg bg-yellow-100 py-5 px-6 text-base text-yellow-700">

                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">

                    <span
                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">

                    </span>

                </div>
                <span className="ml-4">{message}</span>

            </div>
        </div>
    )
}


export default LoadingSpinner