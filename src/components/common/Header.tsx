import React from 'react';

type HeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export default function Header({ title, children }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
          {title}
        </h1>
        {children}
      </div>
    </header>
  );
}
