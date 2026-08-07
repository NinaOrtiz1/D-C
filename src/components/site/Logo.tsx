import logo from "@/assets/logo.png";

export function Logo({
  className = "h-9 w-9",
  withName = true,
  nameClassName = "",
}: {
  className?: string;
  withName?: boolean;
  nameClassName?: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={logo}
        alt="Logotipo de D&C Innovación"
        width={1024}
        height={1024}
        className={`${className} object-contain`}
      />
      {withName ? (
        <span className={`font-display text-base font-semibold tracking-tight ${nameClassName}`}>
          D&C <span className="text-wine">Innovación</span>
        </span>
      ) : null}
    </span>
  );
}
