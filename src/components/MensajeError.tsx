export default function MensajeError({ mensaje }: { mensaje?: string }) {
  if (!mensaje) {
    return null;
  }

  return (
    <p className="mb-4 max-w-lg rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {mensaje}
    </p>
  );
}
