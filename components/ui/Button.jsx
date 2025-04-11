export default function Button({ children, onClick, type = "button" }) {
    return (
      <button
        type={type}
        onClick={onClick}
        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
      >
        {children}
      </button>
    );
  }
  