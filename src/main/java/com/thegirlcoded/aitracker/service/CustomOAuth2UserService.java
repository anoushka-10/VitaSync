package com.thegirlcoded.aitracker.service;

import com.thegirlcoded.aitracker.Entity.User;
import com.thegirlcoded.aitracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        return processOAuth2User(oAuth2User);
    }

    private OAuth2User processOAuth2User(OAuth2User oAuth2User) {
        String googleSub = oAuth2User.getAttribute("sub");
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        
        Optional<User> userOptional = userRepository.findByGoogleSub(googleSub);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Update email/name if changed
            user.setEmail(email);
            user.setName(name);
        } else {
            user = new User();
            user.setGoogleSub(googleSub);
            user.setEmail(email);
            user.setName(name);
            // Default values for new user
            user.setTargetCalories(2000);
        }
        userRepository.save(user);

        return oAuth2User;
    }
}
