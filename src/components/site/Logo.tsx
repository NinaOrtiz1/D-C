import logo from "@/assets/logo.png?url";

export function Logo({
  className = "h-10 w-10 sm:h-11 sm:w-11",
  withName = true,
  nameClassName = "",
}: {
  className?: string;
  withName?: boolean;
  nameClassName?: string;
}) {
  return (
    <span className="flex items-center gap-3 sm:gap-4">
      <img
        src={logo}
        alt="Logotipo de DYC"
        width={1024}
        height={1024}
        loading="lazy"
        decoding="async"
        className={`${className} object-contain`}
      />
      {withName ? (
        <span
          className={`font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight ${nameClassName}`}
        >
          <span className="text-aether">DYC</span>
        </span>
      ) : null}
    </span>
  );
}
