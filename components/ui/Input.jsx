export default function Input({ type = "text", name, placeholder, value, onChange }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded px-3 py-2 w-full"
    />
  );
}
