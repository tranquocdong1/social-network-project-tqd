export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-7 col-lg-5">
        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <h1 className="h4 fw-bold mb-1">{title}</h1>
            {subtitle && <p className="text-muted mb-4">{subtitle}</p>}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
