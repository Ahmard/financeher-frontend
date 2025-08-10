interface IProps {
  name: string;
  className?: string;
}

export default function PageHeader({name, className}: IProps) {
  return (<h1 className={`text-2xl font-semibold text-[#006A4B] ${className}`}>{name}</h1>)
}