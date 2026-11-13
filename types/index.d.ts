export interface ClientInspection {
  conexao: {
    ip: string;
    tipo: 'IPv4' | 'IPv6';
    porta?: number;
    protocolo?: string;
  };
  geolocalizacao: {
    pais: string;
    cidade?: string;
    estado?: string;
    fusoHorario?: string;
    asn?: number;
    provedor?: string;
  };
  cliente: {
    navegador: string;
    versaoNavegador: string;
    sistemaOperacional: string;
    dispositivo: 'Desktop' | 'Mobile' | 'Tablet';
  };
}

export class ClientInspectorPro {
  static inspecionar(request: Request): ClientInspection;
}

export default ClientInspectorPro;
