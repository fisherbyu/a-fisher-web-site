import { DisplayAttributeDataProps } from './display-attribute-data.types';

export const DisplayAttributeData = ({ title, text }: DisplayAttributeDataProps) => {
    return (
        <div className="flex flex-col justify-start">
            <h3 className="font-medium">{title}</h3>
            <p className="font-light">{text}</p>
        </div>
    );
};
