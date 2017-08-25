import styled from 'styled-components';

export const Header = styled.div`
	font-size: 1.3em;
	margin: 15px 0;
	text-align: ${props => props.textAlign || 'center'};
`;

export const SimpleWrapper = styled.div`
	margin: 10px 5px;
	max-width: ${props => props.maxWidth || '500px'};
	min-width: ${props => props.minWidth || '500px'};
`
