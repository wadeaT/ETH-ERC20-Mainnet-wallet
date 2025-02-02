// src/components/common/FormLayout.js
export function FormLayout({ children, title, subtitle }) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Header showBackButton={true}/>
        <main className="max-w-md mx-auto">
          {title && (
            <h2 className="text-2xl font-bold text-blue-400 mb-8 text-center">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground text-center mb-6">
              {subtitle}
            </p>
          )}
          {children}
        </main>
      </div>
    );
  }