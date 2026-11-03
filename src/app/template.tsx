// Recria a cada troca de página, fazendo o conteúdo entrar suavemente.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="pagina">{children}</div>;
}
