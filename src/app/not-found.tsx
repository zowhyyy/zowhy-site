import Link from "next/link";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-xl px-4 pt-20 text-center sm:px-6">
      <p className="titulo text-6xl">Página não encontrada</p>
      <p className="mt-3 text-suave">O link pode estar errado ou a peça saiu do site.</p>
      <Link href="/loja" className="btn btn-cheio mt-6">
        Ir para a loja
      </Link>
    </div>
  );
}
