import './Diploma.css'
import LogoAnjo from '../../assets/logoAnjo.png'
import LogoBandeira from '../../assets/bandeira.png'

const Diploma = () => {
  return (
    <div className='diploma_container'>
      <div className="diploma_impressao">
        <div className='diploma_borda'>
          <div className="diploma_headers">
            <div className="logo_anjo">
              <img className="bandeira" src={LogoBandeira} alt="" />
              <div className='logo_anjo_text'>
                <h1>REPÚBLICA FEDERATIVA DO BRASIL </h1>
                <h2>Escola de Enfermagem Anjo Gabriel Ltda. </h2>
              </div>

              <img src={LogoAnjo} alt="" />
            </div>

            <p>Av. Altamirando de Araújo Ramos , 278 - 1º andar - Centro - Simões Filho - Bahia
              ENTIDADE MANTENEDORA: SOCIEDADE CIVIL ESCOLA DE AUXILIAR DE ENFERMAGEM ANJO GABRIEL LTDA.
              PARECER CEE- Nº 58/2018,  RESOLUÇÃO  CEE- Nº 36/2018, D.O. DE 03/03/2018
              CNPJ02.422.402/0001-00
            </p>
            <h3>DIPLOMA</h3>
          </div>
          <div className="diploma_content">
            <p>A DIRETORA da Escola de Enfermagem Anjo Gabriel de acordo com a Lei 9394/96
              confere o título de Técnico em Enfermagem a
              Stefhany de Amaral de Souza RG nº. 16417109 69
              filho(a) de Geosvaldo Santos de Souza  e  de  Ednilza Pereira de Amaral Souza, natural de Candeias - Ba
              nascido(a) em 16/11/2000 nacionalidade brasileira por haver concluído o
              Curso de Educação  Profissional Técnica de Nível Médio em Enfermagem
              no eixo tecnológico  ambiente e saúde  no ano de 2023
              O presente Diploma outorga-lhe os direitos e prerrogativas estabelecidas nas Leis Vigentes do  Pais.
            </p>
          </div>
          <div className="assinaturas">
            <div className="diploma_assinatura_top">
              <p>     Simões Filho / Ba,  ___________________</p>
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
  )
}

export default Diploma