import './Diploma.css';
import LogoAnjo from '../../assets/logoAnjo.png';
import LogoAnjo2 from '../../assets/logoAnjo2.png';
import LogoBandeira from '../../assets/bandeira.png';
// import { useEffect, useState } from 'react';
// import api from '../../services/api'; // Ajuste o caminho conforme necessário

const Diploma = () => {

  // const [aluno, setAluno] = useState(null);

  // useEffect(() => {
  //   const fetchAluno = async (id) => {
  //     try {
  //       const response = await api.get(`/alunos/${id}`); // Busca o aluno pelo ID
  //       setAluno(response.data); // Armazena os dados do aluno
  //     } catch (error) {
  //       console.error('Erro ao buscar aluno no diploma:', error);
  //     }
  //   };
  //   fetchAluno();
  // }, []);

  const handlePrint = () => {
    window.print();
  };

  // if (!aluno) {
  //   return <div>Carregando...</div>;
  // }

  return (
    <div>
      <button onClick={handlePrint} className="aluno-btn">
        Imprimir Diploma
      </button>
      <div className='diploma_container'>
        <div className="diploma_impressao">
          <div className='diploma_borda'>
            <div className="diploma_headers">
              <div className="logo_anjo">
                <img className="bandeira" src={LogoBandeira} alt="" />
                <div className='logo_anjo_text'>
                  <h1>REPÚBLICA FEDERATIVA DO BRASIL</h1>
                  <h2> Escola de Enfermagem Anjo Gabriel Ltda.</h2>
                </div>
                <img src={LogoAnjo} alt="" />
              </div>
              <p>Av. Altamirando de Araújo Ramos, 278 - 1º andar - Centro - Simões Filho - Bahia
                ENTIDADE MANTENEDORA: SOCIEDADE CIVIL ESCOLA DE AUXILIAR DE ENFERMAGEM ANJO GABRIEL LTDA.
                PARECER CEE- Nº 58/2018, RESOLUÇÃO CEE- Nº 36/2018, D.O. DE 03/03/2018
                CNPJ02.422.402/0001-00
              </p>
              <h3>DIPLOMA</h3>
            </div>
              <img className='anjo2' src={LogoAnjo2} alt="" />
            <div className="diploma_content">
              <p>A DIRETORA da Escola de Enfermagem Anjo Gabriel de acordo com a Lei 9394/96
                confere o título de Técnico em Enfermagem a
                Mauricio Silva Oliveira RG nº. 92468500504
                filho(a) de Antonio Duarte e de Josefa Oliveira, natural de Rio de Janeiro
                nascido(a) em 10/05/1976 nacionalidade brasileira por haver concluído o
                Curso de Educação Profissional Técnica de Nível Médio em Enfermagem
                no eixo tecnológico ambiente e saúde no ano de 2023.
                O presente Diploma outorga-lhe os direitos e prerrogativas estabelecidas nas Leis Vigentes do País.
              </p>
            </div>
            <div className="assinaturas">
              <div className="diploma_assinatura_top">
                <p>Simões Filho / Ba, ___________________</p>
              </div>
              <div className="assinaturas_bottom">
                <div>
                  <div className='assinaturas_line'></div>
                  <p>concluinte</p>
                </div>
                <div>
                  <div className='assinaturas_line'></div>
                  <p>Secretário (a)</p>
                </div>
                <div>
                  <div className='assinaturas_line'></div>
                  <p>Diretor(a)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diploma;