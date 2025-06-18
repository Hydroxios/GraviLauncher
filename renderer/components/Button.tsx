interface ButtonProps {
    children: React.ReactNode
    onClick?: () => void
}

const Button = ({
    children,
    onClick
} :ButtonProps) => {
  return (
    <button 
        className="relative inline-flex items-center justify-center px-8 py-2.5 overflow-hidden tracking-tighter text-white bg-white/10 backdrop-blur-md border border-white/30 rounded shadow-md transition-all duration-200 hover:bg-orange-600/80 hover:border-orange-400/60 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400/40 font-semibold"
        onClick={onClick}
    >
      <span className="relative text-base font-semibold z-10">{children}</span>
      <span className="absolute inset-0 rounded opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-orange-600"></span>
    </button>
  );
};

export default Button;
