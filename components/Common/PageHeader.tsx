interface IProps {
  name: string;
}

export default function PageHeader({name}: IProps) {
  return (<h1 className="text-2xl font-semibold text-[#006A4B]">{name}</h1>)
}