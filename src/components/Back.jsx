import { useNavigate } from 'react-router-dom';

const Back = () => {

    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate(-1);
      };
      
  return (
    <div className='mb-8'>
    <button
    onClick={handleBackClick}
      className="cursor-pointer bg-gradient-to-b from-gray-800 to-gray-800  px-6 py-3 rounded-xl border-[1px] border-slate-500 text-white font-medium group"
    >
      <div className="relative overflow-hidden">
        <p
          className="group-hover:-translate-y-7 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
        >
          Back
        </p>
        <p
          className="absolute top-7 left-0 group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]"
        >
          Back
        </p>
      </div>
    </button>

  </div>
  )
}

export default Back