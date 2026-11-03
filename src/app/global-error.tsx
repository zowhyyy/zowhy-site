"use client";

/** Aparece só se o próprio layout do site falhar; por isso traz o html e os estilos aqui mesmo. */
export default function ErroGeral({ reset }: { reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#fff",
          color: "#25201d",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 16,
        }}
      >
        <div>
          <h1 style={{ color: "#822434", fontSize: 32, margin: 0 }}>Algo deu errado</h1>
          <p>Não conseguimos abrir o site agora. Tente de novo em instantes.</p>
          <button
            type="button"
            onClick={reset}
            style={{ background: "#822434", color: "#fff", border: 0, borderRadius: 999, padding: "12px 24px", fontSize: 16, cursor: "pointer" }}
          >
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  );
}
