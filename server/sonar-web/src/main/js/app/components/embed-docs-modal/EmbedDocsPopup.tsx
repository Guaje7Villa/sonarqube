/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Link } from 'react-router';
import ProductNewsMenuItem from './ProductNewsMenuItem';
import { SuggestionLink } from './SuggestionsProvider';
import { CurrentUser, isLoggedIn } from '../../types';
import { translate } from '../../../helpers/l10n';
import { getBaseUrl } from '../../../helpers/urls';
import { isSonarCloud } from '../../../helpers/system';
import { DropdownOverlay } from '../../../components/controls/Dropdown';

interface Props {
  currentUser: CurrentUser;
  onClose: () => void;
  suggestions: Array<SuggestionLink>;
}

export default class EmbedDocsPopup extends React.PureComponent<Props> {
  static contextTypes = {
    openProjectOnboarding: PropTypes.func
  };

  onAnalyzeProjectClick = (event: React.SyntheticEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.currentTarget.blur();
    this.context.openProjectOnboarding();
  };

  renderTitle(text: string) {
    return <li className="menu-header">{text}</li>;
  }

  renderSuggestions() {
    if (this.props.suggestions.length === 0) {
      return null;
    }
    return (
      <>
        {this.renderTitle(translate('embed_docs.suggestion'))}
        {this.props.suggestions.map((suggestion, index) => (
          <li key={index}>
            <Link onClick={this.props.onClose} target="_blank" to={suggestion.link}>
              {suggestion.text}
            </Link>
          </li>
        ))}
        <li className="divider" />
      </>
    );
  }

  renderIconLink(link: string, icon: string, text: string) {
    return (
      <a href={link} rel="noopener noreferrer" target="_blank">
        <img
          alt={text}
          className="spacer-right"
          height="18"
          src={`${getBaseUrl()}/images/${icon}`}
          width="18"
        />
        {text}
      </a>
    );
  }

  renderSonarCloudLinks() {
    return (
      <React.Fragment>
        <li className="divider" />
        <li>
          <a
            href="https://community.sonarsource.com/c/help/sc"
            rel="noopener noreferrer"
            target="_blank">
            {translate('embed_docs.get_help')}
          </a>
        </li>
        <li className="divider" />
        {this.renderTitle(translate('embed_docs.stay_connected'))}
        <li>
          {this.renderIconLink(
            'https://twitter.com/sonarcloud',
            'embed-doc/twitter-icon.svg',
            'Twitter'
          )}
        </li>
        <li>
          {this.renderIconLink(
            'https://blog.sonarsource.com/product/SonarCloud',
            'sonarcloud-square-logo.svg',
            translate('embed_docs.news')
          )}
        </li>
        <li>
          <ProductNewsMenuItem tag="SonarCloud" />
        </li>
      </React.Fragment>
    );
  }

  renderSonarQubeLinks() {
    return (
      <React.Fragment>
        {isLoggedIn(this.props.currentUser) && (
          <li>
            <a href="#" onClick={this.onAnalyzeProjectClick}>
              {translate('embed_docs.analyze_new_project')}
            </a>
          </li>
        )}
        <li className="divider" />
        <li>
          <a href="https://community.sonarsource.com/" rel="noopener noreferrer" target="_blank">
            {translate('embed_docs.get_help')}
          </a>
        </li>
        <li className="divider" />
        {this.renderTitle(translate('embed_docs.stay_connected'))}
        <li>
          {this.renderIconLink(
            'https://www.sonarsource.com/resources/product-news/',
            'embed-doc/sq-icon.svg',
            translate('embed_docs.news')
          )}
        </li>
        <li>
          {this.renderIconLink(
            'https://twitter.com/SonarQube',
            'embed-doc/twitter-icon.svg',
            'Twitter'
          )}
        </li>
      </React.Fragment>
    );
  }

  render() {
    return (
      <DropdownOverlay>
        <ul className="menu abs-width-240">
          {this.renderSuggestions()}
          <li>
            <Link onClick={this.props.onClose} target="_blank" to="/documentation">
              {translate('embed_docs.documentation')}
            </Link>
          </li>
          <li>
            <Link onClick={this.props.onClose} to="/web_api">
              {translate('api_documentation.page')}
            </Link>
          </li>
          {isSonarCloud() ? this.renderSonarCloudLinks() : this.renderSonarQubeLinks()}
        </ul>
      </DropdownOverlay>
    );
  }
}
