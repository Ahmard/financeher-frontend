interface IProps {
    title: string;
    subtitle: string;
    className?: string;
    withBottomBoarder?: boolean;
}

export default function PageHeader(props: IProps) {
    const {title, subtitle, className, withBottomBoarder} = props;
    return (
        <div>
            <h1 className={`text-3xl font-semibold text-[#006A4B] ${className}`}>{title}</h1>
            <h4 className="text-[17px] mt-1 text-[#71717A]">{subtitle}</h4>
            {withBottomBoarder && (<div className="border border-b-1 my-4"></div>)}
        </div>
    )
}