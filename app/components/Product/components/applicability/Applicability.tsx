import { Title } from '@/app/components/Title/Title';
import styles from './applicability.module.css';
import { IPublicAutoModels } from '@/interface/publicPart/publicPart.interface';
import classNames from 'classnames';
import PageContent from '@/app/components/PageContent/PageContent';

interface IProps {
  autoModels: IPublicAutoModels[];
}

export const Applicability = ({ autoModels }: IProps) => {
  return (
    <PageContent className={styles.container}>
      <Title tag="h2">Применяемость</Title>
      {autoModels.map((model, index) => (
        <div key={`${model.autoType.id}__${index}`} className={styles.model}>
          <span>{model.autoType.name}</span>
          {model.autoBrand.name && <span>, {model.autoBrand.name}</span>}
          {model.autoModel.name && <span>{model.autoModel.name}</span>}
          {!!model.autoModel.externalScheme && (
            <a
              className={classNames(['button-transparent', styles.button])}
              href={model.autoModel.externalScheme}
              target="_blank"
            >
              Показать схему
            </a>
          )}
        </div>
      ))}
    </PageContent>
  );
};
